import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the page without blowing up (smoke-test)", () => {
  render(<App />);
  const textOnPage = screen.getByText(/see what other students had to say!/);
  expect(textOnPage).toBeInTheDocument();
});
