import { FastifyRequest } from "fastify";
import { Role, RoleType } from "src/common/constants/typecontants"; // Make sure RoleType is exported
import { AuthError } from "src/utils/errors";
import { verifyAccessToken } from "src/utils/jwt";

// Pause API hook that throws an AuthError
export const pauseApiHook = async () => {
  throw new AuthError("Chức năng bị tạm ngưng");
};

// Hook to require a logged-in user (valid access token)
export const requireLoginedHook = async (request: FastifyRequest) => {
  const accessToken = request.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    throw new AuthError("Không nhận được access token");
  }

  try {
    const decodedAccessToken = verifyAccessToken(accessToken);
    (request as any).decodedAccessToken = decodedAccessToken;
  } catch (error) {
    throw new AuthError("Access token không hợp lệ");
  }
};

// Hook to require a specific role
export const requireRoleHook = async (
  request: FastifyRequest,
  allowedRoles: RoleType[] // Use RoleType[] here, because it's a union of "Owner" | "Employee" | "Guest"
) => {
  if (!(request as any).decodedAccessToken) {
    await requireLoginedHook(request);
  }

  const userRole = (request as any).decodedAccessToken?.role;

  if (!allowedRoles.includes(userRole)) {
    throw new AuthError("Bạn không có quyền truy cập");
  }
};

// Specific hooks for each role
export const requireOwnerHook = async (request: FastifyRequest) => {
  await requireRoleHook(request, [Role.Owner]);
};

export const requireEmployeeHook = async (request: FastifyRequest) => {
  await requireRoleHook(request, [Role.Employee]);
};

export const requireGuestHook = async (request: FastifyRequest) => {
  await requireRoleHook(request, [Role.Guest]);
};
