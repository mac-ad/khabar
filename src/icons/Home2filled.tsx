import Svg, { Path } from "react-native-svg";

interface IconProps {
    width?: number;
    height?: number;
    color?: string;
}

export default function Home2filled({ width = 24, height = 24, color = "#343C54" }: IconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
            <Path d="M13.85 3.70391C13.05 3.10391 11.95 3.10391 11.15 3.70391L4.65 8.57891C4.08344 9.00383 3.75 9.6707 3.75 10.3789V18.5003C3.75 19.743 4.75736 20.7503 6 20.7503H10.25C10.6642 20.7503 11 20.4145 11 20.0003V17.0003C11 16.1719 11.6716 15.5003 12.5 15.5003C13.3284 15.5003 14 16.1719 14 17.0003V20.0003C14 20.4145 14.3358 20.7503 14.75 20.7503H19C20.2426 20.7503 21.25 19.743 21.25 18.5003V10.3789C21.25 9.6707 20.9166 9.00383 20.35 8.57891L13.85 3.70391Z" fill={color} />
        </Svg>
    );
}
