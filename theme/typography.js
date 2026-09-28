// Type tokens — Outfit is the app's one type family (no chat surface exists
// yet, so Resettle Glass's Poppins "chat" family isn't ported).
export const fontFamilies = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semiBold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
};

const weightToFamily = {
  400: fontFamilies.regular,
  500: fontFamilies.medium,
  600: fontFamilies.semiBold,
  700: fontFamilies.bold,
};

const style = (fontSize, lineHeight, fontWeight) => ({
  fontFamily: weightToFamily[fontWeight],
  fontSize,
  lineHeight,
  fontWeight: String(fontWeight),
});

export const typography = {
  display: style(32, 38, 700),

  headerTitle: style(20, 24, 600),
  sectionTitle: style(18, 23, 600),
  cardTitle: style(17, 22, 600),

  body: style(16, 22, 400),
  bodySm: style(14, 20, 400),

  button: style(16, 20, 500),
  chip: style(13, 16, 500),
  chipSelected: style(14, 17, 600),
  caption: style(12, 18, 400),
  label: style(13, 17, 400),
};
