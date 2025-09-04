import styled, { css } from 'styled-components/native';
import { COLORS, FONTS } from '../constants';

interface TextProps {
  color?: string;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  body1?: boolean;
  body2?: boolean;
  body3?: boolean;
  body4?: boolean;
  body5?: boolean;
  body6?: boolean;
}

interface ImageProps {
  size?: number;
}

const McText = styled.Text<TextProps>`
  color: ${({ color }) => (color ? color : COLORS.default)};

  ${({ h1, h2, h3, h4, h5, h6 }) => {
    switch (true) {
      case !!h1: return css`${FONTS.h1}`;
      case !!h2: return css`${FONTS.h2}`;
      case !!h3: return css`${FONTS.h3}`;
      case !!h4: return css`${FONTS.h4}`;
      case !!h5: return css`${FONTS.h5}`;
      case !!h6: return css`${FONTS.h6}`;
    }
  }}

  ${({ body1, body2, body3, body4, body5, body6 }) => {
    switch (true) {
      case !!body1: return css`${FONTS.body1}`;
      case !!body2: return css`${FONTS.body2}`;
      case !!body3: return css`${FONTS.body3}`;
      case !!body4: return css`${FONTS.body4}`;
      case !!body5: return css`${FONTS.body5}`;
      case !!body6: return css`${FONTS.body6}`;
    }
  }}
`;

const McIcon = styled.Image<ImageProps>`
  width: ${({ size }) => (size ? `${size}px` : '16px')};
  height: ${({ size }) => (size ? `${size}px` : '16px')};
`;

const McAvatar = styled.Image<ImageProps>`
  width: ${({ size }) => (size ? `${size}px` : '40px')};
  height: ${({ size }) => (size ? `${size}px` : '40px')};
`;

export { McText, McIcon, McAvatar };
