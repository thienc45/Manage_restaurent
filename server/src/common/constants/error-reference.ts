// dùng trong prima

export const PrismaErrorCode = {
  UniqueConstraintViolation: "P2002", //Lỗi trùng dữ liệu (Unique Constraint Violation).
  RecordNotFound: "P2025", //  Không tìm thấy bản ghi (Record Not Found).
} as const;

// Prisma có nhiều mã lỗi khác nhau, một số lỗi quan trọng bao gồm:

// Mã lỗi	Ý nghĩa
// P2000	Giá trị nhập vào quá dài
// P2001	Không tìm thấy bản ghi với điều kiện truy vấn
// P2002	Vi phạm ràng buộc unique
// P2003	Vi phạm khóa ngoại (Foreign Key Constraint)
// P2004	Lỗi vi phạm ràng buộc trong database
// P2025	Không tìm thấy bản ghi để xóa hoặc cập nhật
