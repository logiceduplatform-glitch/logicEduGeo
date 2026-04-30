import React from "react";

/**
 * Injects SVG <filter> definitions used by accessibility color-blind classes.
 * These re-color the entire page via CSS `filter: url(#a11y-cb-...)` to simulate
 * how the page would look to a person with color-vision deficiency, OR to
 * remap palette to be CVD-friendly.
 *
 * Render this component once at the top of the App tree.
 *
 * Matrices reference: Coblis / Daltonization research (LMS color-space approximations).
 */
export default function AccessibilitySVGFilters() {
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
      <defs>
        {/* Deuteranopia (green-blind) */}
        <filter id="a11y-cb-deuteranopia">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.367  0.861 -0.228  0  0
                    0.280  0.673  0.047  0  0
                   -0.012  0.043  0.969  0  0
                    0      0      0      1  0"
          />
        </filter>

        {/* Protanopia (red-blind) */}
        <filter id="a11y-cb-protanopia">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.152  1.053 -0.205  0  0
                    0.115  0.786  0.099  0  0
                   -0.004 -0.048  1.052  0  0
                    0      0      0      1  0"
          />
        </filter>

        {/* Tritanopia (blue-yellow blind) */}
        <filter id="a11y-cb-tritanopia">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1.255 -0.077 -0.178  0  0
                   -0.078  0.931  0.148  0  0
                    0.005  0.691  0.304  0  0
                    0      0      0      1  0"
          />
        </filter>
      </defs>
    </svg>
  );
}
