export type VoucherResult = { code?: string, discount: number, reason?: string }

export function applyVoucher(subtotal: number, code?: string): VoucherResult {
  if (!code) return { discount: 0 }
  const c = code.trim().toUpperCase()
  if (c === 'HAPN50' && subtotal >= 300) return { code: c, discount: 50 }
  if (c === 'WELCOME10' && subtotal >= 0) return { code: c, discount: Math.min(subtotal * 0.10, 100) }
  return { discount: 0, reason: 'invalid voucher' }
}

export function deliveryFee(distanceKm: number, base=30, perKm=8): number {
  const extra = Math.max(0, distanceKm - 6) * perKm
  return Math.round(base + extra)
}
