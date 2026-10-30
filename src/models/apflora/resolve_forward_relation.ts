export interface resolve_forward_relation_params {
  p_table: string;

  p_relation_key: string;

  parent_table: string;

  parent_col: string;

  child_col: string;
}

/** Return type for resolve_forward_relation */
export interface resolve_forward_relation_return_type {
  parent_table: string;

  parent_col: string;

  child_col: string;
}