import Svg, { Path } from "react-native-svg";

interface IconProps {
    width?: number;
    height?: number;
    color?: string;
}

export default function Bookmark1filled({ width = 24, height = 24, color = "#343C54" }: IconProps) {
    return (
        <Svg width={width} height={height} viewBox="0 0 25 25" fill="none">
            <Path d="M5 4.40088C5 3.15824 6.00736 2.15088 7.25 2.15088H17.75C18.9926 2.15088 20 3.15824 20 4.40088V21.4009C20 21.6775 19.8478 21.9316 19.6039 22.0621C19.36 22.1926 19.0641 22.1783 18.834 22.0249L12.916 18.0796C12.6641 17.9117 12.3359 17.9117 12.084 18.0796L6.16603 22.0249C5.93588 22.1783 5.63997 22.1926 5.39611 22.0621C5.15224 21.9316 5 21.6775 5 21.4009V4.40088Z" fill={color} />
        </Svg>
    );
}
