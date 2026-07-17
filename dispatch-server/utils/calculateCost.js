// Pricing: first kg included in the base, extra weight charged per kg.
// Inter-district costs more than same-district.
const calculateCost = (weight, pickupDistrict, deliveryDistrict) => {
  const sameDistrict = pickupDistrict === deliveryDistrict;
  const base = sameDistrict ? 60 : 100;
  const perKg = sameDistrict ? 20 : 40;
  const extraWeight = Math.max(0, weight - 1); // first kg free
  return Math.round(base + extraWeight * perKg);
};

module.exports = calculateCost;
