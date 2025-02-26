import { Prisma } from "@prisma/client";

// Lỗi dữ liệu không hợp lệ (Validation Error)
export class EntityError extends Error {
  fields: { message: string; field: string }[];
  status: number = 422;
  constructor(fields: { message: string; field: string }[]) {
    super("Lỗi xác thực dữ liệu");
    this.fields = fields;
  }
}

// Không có quyền truy cập (Unauthorized)
export class AuthError extends Error {
  status: number = 401;
  constructor(message: string) {
    super(message);
  }
}

// Bị cấm truy cập tài nguyên (Forbidden)
export class ForbiddenError extends Error {
  status: number = 403;
  constructor(message: string) {
    super(message);
  }
}

// Không tìm thấy tài nguyên (Not Found)
export class NotFoundError extends Error {
  status: number = 404;
  constructor(message: string = "Không tìm thấy tài nguyên") {
    super(message);
  }
}

// Dữ liệu bị xung đột (Conflict)
export class ConflictError extends Error {
  status: number = 409;
  constructor(message: string = "Dữ liệu bị xung đột") {
    super(message);
  }
}

// Dữ liệu đầu vào không hợp lệ (Bad Request)
export class BadRequestError extends Error {
  status: number = 400;
  constructor(message: string = "Dữ liệu không hợp lệ") {
    super(message);
  }
}

// Quá nhiều request trong thời gian ngắn (Rate Limiting)
export class TooManyRequestsError extends Error {
  status: number = 429;
  constructor(message: string = "Quá nhiều yêu cầu, vui lòng thử lại sau") {
    super(message);
  }
}

// Lỗi server nội bộ (Internal Server Error)
export class InternalServerError extends Error {
  status: number = 500;
  constructor(message: string = "Lỗi máy chủ nội bộ") {
    super(message);
  }
}

export class StatusError extends Error {
  status: number;
  constructor({ message, status }: { message: string; status: number }) {
    super(message);
    this.status = status;
  }
}

// Lỗi chung có thể đặt mã HTTP bất kỳ
export function isPrismaClientKnownRequestError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

// cách dùng
// throw new NotFoundError("Người dùng không tồn tại");   // 404
// throw new ConflictError("Email đã được sử dụng");      // 409
// throw new BadRequestError("Mật khẩu không hợp lệ");    // 400
// throw new TooManyRequestsError();                      // 429
