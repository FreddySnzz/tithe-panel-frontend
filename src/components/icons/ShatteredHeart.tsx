import React from 'react';

export interface ShatteredHeartIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const ShatteredHeartIcon: React.FC<ShatteredHeartIconProps> = ({
  size = 24,
  color = 'currentColor',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 280 245"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Corpo principal do coração com os três recortes em cunha */}
      <path
        d="M 145 31
           C 178 -1, 245 0, 267 48
           C 278 73, 275 100, 267 120
           L 172 106
           L 227 177
           C 201 206, 169 229, 145 242
           C 127 233, 108 221, 90 207
           L 124 130
           L 52 175
           C 32 152, 20 127, 17 104
           L 121 92
           L 34 36
           C 62 -4, 114 -1, 145 31
           Z"
        fill={color}
      />

      {/* Estilhaço superior esquerdo */}
      <path
        d="M 13 28
           L 106 88
           L 3 100
           C -2 75, 2 50, 13 28
           Z"
        fill={color}
      />

      {/* Estilhaço inferior esquerdo */}
      <path
        d="M 107 140
           L 77 215
           C 62 200, 38 190, 60 179
           L 103 150
           Z"
        fill={color}
      />

      {/* Estilhaço inferior direito */}
      <path
        d="M 183 114
           L 278 128
           C 270 151, 256 172, 245 190
           L 183 114
           Z"
        fill={color}
      />
    </svg>
  );
};

export default ShatteredHeartIcon;