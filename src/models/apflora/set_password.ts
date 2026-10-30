export interface set_password_params {
  p_username: string;

  p_new_pass: string;

  p_old_pass: string;
}

/** Return type for set_password */
export type set_password_return_type = string;