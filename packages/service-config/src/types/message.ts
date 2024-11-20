export enum OrderMessage {
  ORDER_INITIATED = "ORDER_INITIATED",
  ORDER_STATUS = "ORDER_STATUS",
  ORDER_PROCESSING = "ORDER_PROCESSING",
  ORDER_DELIVERED = "ORDER_DELIVERED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
}

export enum RedisMessage {
  COD_ORDER = "COD_ORDER",
  PREPAID_ORDER = "PREPAID_ORDER",
  PAYMENT_RESULT = "PAYMENT_RESULT",
  VENDOR_MSG = "VENDOR_MSG",
  USER_MSG = "USER_MSG",
  DELIVERY_MSG = "DELIVERY_MSG",
  ADMIN_MSG = "ADMIN_MSG",
  CHECKOUT_RESULT = "CHECKOUT_RESULT",
}

export enum PaymentMessage {
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
  PAYMENT_COMPLETED = "PAYMENT_COMPLETED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
}

export enum SocketMessage {
  VENDOR_MSG = "VENDOR_MSG",
  USER_MSG = "USER_MSG",
  DELIVERY_MSG = "DELIVERY_MSG",
  ADMIN_MSG = "ADMIN_MSG",
}