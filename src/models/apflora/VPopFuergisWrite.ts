/** Represents the view apflora.v_pop_fuergis_write */
export default interface VPopFuergisWrite {
  ap_id: string;

  id: string;

  nr: number | null;

  name: string | null;

  status: number | null;

  status_unklar: boolean | null;

  status_unklar_begruendung: string | null;

  bekannt_seit: number | null;

  geom_point: unknown | null;

  created_at: string;

  updated_at: string;

  changed_by: string | null;
}