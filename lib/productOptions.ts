export function getProductOptions(slug: string, category: string) {
  const optionsBySlug: Record<string, { label: string; options: string[] }> = {
    "wireless-headphones": { label: "Select Colour", options: ["Black", "White"] },
    "smartwatch-pro": { label: "Select Colour", options: ["Black", "Silver"] },
    "bluetooth-speaker": { label: "Select Colour", options: ["Black", "Blue"] },
    "minimal-backpack": { label: "Select Size", options: ["Standard", "Large"] },
    "cotton-crewneck-tee": { label: "Select Size", options: ["S", "M", "L", "XL"] },
    "running-shoes": { label: "Select Shoe Size", options: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"] },
    "ceramic-mug": { label: "Select Size", options: ["300ml", "500ml"] },
    "glass-water-bottle": { label: "Select Size", options: ["500ml", "750ml", "1L"] },
    "modern-table-lamp": { label: "Select Size", options: ["Standard", "Large"] },
    "skincare-serum": { label: "Select Size", options: ["30ml", "50ml"] },
    "sunglasses": { label: "Select Size", options: ["One Size"] },
    "makeup-palette": { label: "Select Shades", options: ["12 Shades", "18 Shades"] },
  };

  if (optionsBySlug[slug]) return optionsBySlug[slug];
  if (category === "Fashion") return { label: "Select Size", options: ["S", "M", "L", "XL"] };
  if (category === "Beauty") return { label: "Select Size", options: ["Standard", "Large"] };
  return { label: "Select Variant", options: ["Standard"] };
}
