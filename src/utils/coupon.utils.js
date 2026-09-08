export const AVAILABLE_COUPONS = {
  SAVE10: {
    code: "SAVE10",
    type: "percentage",
    value: 10,
    description: "10% off the subtotal",
  },
  SAVE20: {
    code: "SAVE20",
    type: "percentage",
    value: 20,
    description: "20% off the subtotal",
  },
  SAVE50: {
    code: "SAVE50",
    type: "percentage",
    value: 50,
    description: "50% off the subtotal",
  },
  SAVE80: {
    code: "SAVE80",
    type: "percentage",
    value: 80,
    description: "80% off the subtotal",
  },
  OFF50: {
    code: "OFF50",
    type: "fixed",
    value: 50,
    description: "50 EGP off the subtotal",
  },
};

// التحقق من صحة الكوبون
export function validateCoupon(code) {
  const coupon = AVAILABLE_COUPONS[code];
  if (!coupon) {
    return {
      valid: false,
      message: "Invalid coupon code",
    };
  }
  return {
    valid: true,
    coupon,
  };
}

// حساب قيمة الخصم
export function calculateDiscount(coupon, subtotal) {
  if (!coupon) return 0;

  if (coupon.type === "percentage") {
    return (subtotal * coupon.value) / 100;
  } else if (coupon.type === "fixed") {
    return Math.min(coupon.value, subtotal);
  }
  return 0;
}

// الحصول على كوبون بالكود
export function getCouponByCode(code) {
  return AVAILABLE_COUPONS[code] || null;
}