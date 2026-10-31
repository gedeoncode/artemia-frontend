"use client";

const Footer = () => {
  // Back to top button functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#232F3E] text-white">
      {/* Back to top button */}
      <div className="bg-[#37475A] py-3 text-center">
        <button
          onClick={scrollToTop}
          className="text-sm font-medium hover:underline"
        >
          Back to top
        </button>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Get to Know Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  About Artemia
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Investor Relations
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Atemia Devices
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Atemia Science
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Make Money with Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  Sell products on Atemia
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Sell on Atemia Business
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Sell apps on Atemia
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Become an Affiliate
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Advertise Your Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Self-Publish with Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Artemia Payment Products</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  Atemia Business Card
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shop with Points
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Reload Your Balance
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Atemia Currency Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Let Us Help You</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:underline">
                  Atemia and COVID-19
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Your Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Your Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Shipping Rates & Policies
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Returns & Replacements
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Help
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer divider */}
      <div className="border-t border-gray-600"></div>

      {/* Logo and country selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div
            style={{ borderRadius: `${50}%` }}
            className="bg-white w-7 h-7 flex items-center justify-center mr-2"
          >
            <img src="/logo-artemia.png" alt="Artemia" className="h-7" />
          </div>
          <div className="flex items-center border border-gray-400 px-2 py-1 rounded">
            <span className="text-xs mr-1">🌐</span>
            <span className="text-xs mr-1">Français</span>
            <span className="text-xs">▼</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <a href="#" className="text-xs hover:underline">
            Conditions of Use
          </a>
          <a href="#" className="text-xs hover:underline">
            Privacy Notice
          </a>
          <a href="#" className="text-xs hover:underline">
            Your Ads Privacy Choices
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#131A22] py-4 text-center">
     
        <p className="text-xs text-gray-400">
          © 1996-{new Date().getFullYear()}, Atemia.com, Inc. or its affiliates
        </p>
      </div>
    </footer>
  );
};

export default Footer;
