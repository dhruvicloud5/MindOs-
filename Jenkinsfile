pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend CI') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                    sh 'npm run lint'
                    sh 'npm test'
                }
            }
        }

        stage('Frontend CI') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run lint'
                    sh 'CI=true npm test -- --runInBand'
                    sh 'npm run build'
                }
            }
        }

        stage('Semgrep SAST') {
            steps {
                sh 'semgrep scan --config auto --error .'
            }
        }

    }

    post {
        always {
            deleteDir()
        }
    }
}
