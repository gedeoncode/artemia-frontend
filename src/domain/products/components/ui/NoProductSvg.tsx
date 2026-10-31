export function NoProductSVG() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <svg
        width="100%"
        height="300"
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7f1d1d" /> {/* red-900 */}
            <stop offset="50%" stopColor="#1d4ed8" /> {/* blue-700 */}
            <stop offset="100%" stopColor="#2563eb" /> {/* blue-600 */}
          </linearGradient>
        </defs>

        <rect width="500" height="300" rx="20" fill="#f9fafb" />

        <g transform="translate(90, 40)">
          <circle cx="160" cy="100" r="80" fill="url(#brandGradient)" opacity="0.2">
            <animate
              attributeName="r"
              values="78;82;78"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          <g>
            <circle cx="160" cy="100" r="40" fill="url(#brandGradient)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 -2; 0 2; 0 -2"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <line
              x1="190"
              y1="130"
              x2="220"
              y2="160"
              stroke="url(#brandGradient)"
              strokeWidth="6"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 -2; 0 2; 0 -2"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
          </g>

          <text
            x="160"
            y="210"
            textAnchor="middle"
            fontSize="20"
            fill="#374151"
            fontFamily="sans-serif"
            opacity="0"
          >
            Aucun produit trouvé
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              begin="0.3s"
              dur="1s"
              fill="freeze"
            />
          </text>

          <text
            x="160"
            y="240"
            textAnchor="middle"
            fontSize="14"
            fill="#6b7280"
            fontFamily="sans-serif"
            opacity="0"
          >
            Essayez d’ajuster vos filtres ou vos mots-clés de recherche
            <animate
              attributeName="opacity"
              from="0"
              to="1"
              begin="0.6s"
              dur="1s"
              fill="freeze"
            />
          </text>
        </g>
      </svg>
    </div>
  );
}