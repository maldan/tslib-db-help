export class DataBaseError extends Error {
  public description: string;

  constructor(description: string) {
    super(description);

    this.description = description;
  }

  toJSON() {
    return {
      description: this.description,
    };
  }
}
