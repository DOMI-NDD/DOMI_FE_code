/** @jsxImportSource @emotion/react */

type LogoProps = {
  fill: string;
  width?: string | number;
  height?: string | number;
};

export default function Logo({ fill, width = 78, height = 80 }: LogoProps) {
  return (
        <svg width={width} height={height} viewBox="0 0 78 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.807907 80V0H37.0675C77.1505 0 87.527 42.3581 69.3759 65.4305C61.0781 54.1595 54.9665 49.664 41.6121 44.7682C37.1494 56.9211 37.5393 64.6939 41.6121 79.8043C40.1414 79.9335 38.6265 80 37.0675 80H0.807907Z" fill={fill}/>
          <path d="M44.9506 66.4901C50.9912 65.6487 53.8414 64.2225 57.6554 59.426C54.3912 65.1251 51.5422 66.554 44.9506 66.4901Z" fill={fill}/>
          <path d="M47.7327 55.011C46.9908 55.011 46.8981 55.9823 47.7327 55.9823C48.5673 55.9823 48.4746 55.011 47.7327 55.011Z" fill={fill}/>
        </svg>


  )
}