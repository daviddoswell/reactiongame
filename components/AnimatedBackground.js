import { animated, useSprings } from "@react-spring/web";
import { useState, useEffect } from "react";

// Some random colors
const colors = ["#ff0066", "#ff5500", "#ffbb00"];

const AnimatedBackground = () => {
  const [toggle, set] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  const springs = useSprings(
    colors.length,
    colors.map((color, i) => ({
      from: {
        r: 0,
        cx: Math.random() * width,
        cy: Math.random() * height,
      },
      to: async (next) => {
        while (1) {
          await next({ r: 0 });
          await next({ r: Math.floor(Math.random() * (width / 2)) });
        }
      },
      config: {
        duration: 2000,
      },
      loop: true,
      onRest: () => set(!toggle),
    }))
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {springs.map((props, i) => (
        <animated.svg
          key={i}
          style={{
            position: "absolute",
            willChange: "transform",
          }}
        >
          <animated.circle {...props} fill={colors[i]} />
        </animated.svg>
      ))}
    </div>
  );
};

export default AnimatedBackground;
