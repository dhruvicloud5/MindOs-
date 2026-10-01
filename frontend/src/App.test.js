import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Reprogram from "./pages/Reprogram";

test("renders the daily habit workspace", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => []
  });
  render(<Reprogram />);

  expect(await screen.findByText(/no habits yet/i)).toBeInTheDocument();
});