import IconContainer from "../components/IconContainer";

const FlagIcon = () => {
  return (
    <IconContainer>
      <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
        <g>
          <polygon
            fill="#d22f27"
            points="67 24 36 33.5 5 43 5 24 5 5 36 14.5 67 24"
          />
        </g>
        <g>
          <g>
            <polygon
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              points="67 24 36 33.5 5 43 5 24 5 5 36 14.5 67 24"
            />
            <line
              x1="5"
              x2="5"
              y1="5"
              y2="67"
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </g>
        </g>
      </svg>
    </IconContainer>
  );
};

export default FlagIcon;
