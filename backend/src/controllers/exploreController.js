const { pool } = require('../config/database');
const https = require('node:https');

// Get all explorations
exports.getExplorations = async (req, res) => {
  try {
    const { type, status, search, favorite } = req.query;
    
    let query = 'SELECT * FROM explorations WHERE user_id = ?';
    const params = [req.user.id];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (favorite === 'true') {
      query += ' AND is_favorite = TRUE';
    }

    query += ' ORDER BY created_at DESC';

    const [explorations] = await pool.query(query, params);
    
    res.json({
      success: true,
      count: explorations.length,
      data: explorations
    });
  } catch (error) {
    console.error('Get explorations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching explorations',
      error: error.message 
    });
  }
};

// Create exploration
exports.createExploration = async (req, res) => {
  try {
    const { type, title, content, tags, related_links, insights, status } = req.body;

    if (!type || !title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Type, title, and content are required' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO explorations (user_id, type, title, content, status, tags, related_links, insights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, type, title, content, status || 'exploring', tags || null, related_links || null, insights || null]
    );

    const [newExploration] = await pool.query(
      'SELECT * FROM explorations WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Exploration created successfully',
      data: newExploration[0]
    });
  } catch (error) {
    console.error('Create exploration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating exploration',
      error: error.message 
    });
  }
};

// Search the web using Google when configured, otherwise DuckDuckGo's free API.
exports.searchGoogle = async (req, res) => {
  try {
    const query = typeof req.body.query === 'string' ? req.body.query.trim() : '';

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchResponse = process.env.GOOGLE_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID
      ? await googleCustomSearch(query)
      : await duckDuckGoSearch(query);

    res.json({ success: true, data: searchResponse });
  } catch (error) {
    console.error('Search error:', error);
    res.status(502).json({ success: false, message: 'Error searching for solutions' });
  }
};

function getJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers }, (response) => {
      let data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(`Search provider returned ${response.statusCode}`));
        }

        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    request.setTimeout(10000, () => request.destroy(new Error('Search provider timed out')));
    request.on('error', reject);
  });
}

async function googleCustomSearch(query) {
  const params = new URLSearchParams({
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
    q: query,
    num: '5'
  });
  const data = await getJson(`https://www.googleapis.com/customsearch/v1?${params}`);

  return {
    correctedQuery: data.spelling?.correctedQuery || null,
    results: (data.items || []).map((item) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      source: new URL(item.link).hostname
    }))
  };
}

async function duckDuckGoSearch(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    no_html: '1',
    skip_disambig: '1'
  });
  const data = await getJson(`https://api.duckduckgo.com/?${params}`, {
    'User-Agent': 'MindOS/1.0'
  });
  const results = [];

  if (data.Abstract) {
    results.push({
      title: data.Heading || 'Answer',
      snippet: data.Abstract,
      link: data.AbstractURL,
      source: data.AbstractSource || 'DuckDuckGo'
    });
  }

  (data.RelatedTopics || []).slice(0, 5).forEach((topic) => {
    if (topic.Text && topic.FirstURL) {
      results.push({
        title: topic.Text.slice(0, 100),
        snippet: topic.Text,
        link: topic.FirstURL,
        source: 'DuckDuckGo'
      });
    }
  });

  return { correctedQuery: null, results };
}

// Update exploration
exports.updateExploration = async (req, res) => {
  try {
    const { type, title, content, status, tags, related_links, insights, is_favorite } = req.body;

    const [result] = await pool.query(
      `UPDATE explorations 
       SET type = ?, title = ?, content = ?, status = ?, tags = ?, 
           related_links = ?, insights = ?, is_favorite = ?
       WHERE id = ? AND user_id = ?`,
      [type, title, content, status, tags, related_links, insights, is_favorite, 
       req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exploration not found' 
      });
    }

    const [updated] = await pool.query(
      'SELECT * FROM explorations WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Exploration updated successfully',
      data: updated[0]
    });
  } catch (error) {
    console.error('Update exploration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating exploration',
      error: error.message 
    });
  }
};

// Delete exploration
exports.deleteExploration = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM explorations WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exploration not found' 
      });
    }

    res.json({
      success: true,
      message: 'Exploration deleted successfully'
    });
  } catch (error) {
    console.error('Delete exploration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting exploration',
      error: error.message 
    });
  }
};