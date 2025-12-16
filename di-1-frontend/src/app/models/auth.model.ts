export interface LoginBody {
  email: string,
  password: string,
}

export interface RegisterBody {
  email: string,
  username: string,
  password: string,
}

export interface User {
  id: string,
  username: string,
  email: string,
}

export interface UserPasswordUpdate {
  oldPassword: string,
  newPassword: string,
}

export interface RegisterResponse {
  success: boolean,
  message: string,
  token: string,
  user: User,
}
