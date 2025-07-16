import type { ISweetRepository } from "../repositories/sweet.repository.js";

export class SweetService {
  constructor(private repository: ISweetRepository) {}
}
