import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/Header";

// Mock WalletConnect component
jest.mock("@/components/WalletConnect", () => ({
	__esModule: true,
	default: () => <div data-testid="wallet-connect">WalletConnect</div>,
}));

describe("Header Component", () => {
	// Manually cleanup the DOM after each test to prevent test pollution
	// and work around the automatic cleanup failing.
	afterEach(cleanup);

	const renderHeader = () => {
		return render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>,
		);
	};

	test("renders the header with the main title", () => {
		renderHeader();
		const titleElement = screen.getByText(/链上红包系统/i);
		expect(titleElement).toBeInTheDocument();
	});

	test("renders navigation links for both desktop and mobile", () => {
		renderHeader();
		// The component renders links for both desktop and mobile, so we use getAllByRole.
		const createLinks = screen.getAllByRole("link", { name: /🎁 创建红包/i });
		const claimLinks = screen.getAllByRole("link", { name: /🧧 抢红包/i });

		expect(createLinks.length).toBeGreaterThan(0);
		for (const link of createLinks) {
			expect(link).toHaveAttribute("href", "/create");
		}

		expect(claimLinks.length).toBeGreaterThan(0);
		for (const link of claimLinks) {
			expect(link).toHaveAttribute("href", "/claim");
		}
	});

	test("renders the WalletConnect component", () => {
		renderHeader();
		const walletConnectElement = screen.getByTestId("wallet-connect");
		expect(walletConnectElement).toBeInTheDocument();
	});
});
