import { DomainError } from "../exceptions/DomainError";

/**
 * Immutable value object representing the dimensions of a shipment.
 */
export class Dimensions {
  getVolume(): number {
    return this.height * this.width * this.length;
  }
    public readonly height: number;
    public readonly width: number;
    public readonly length: number;
  
    /**
     * Constructs a new Dimensions instance.
     * @param height The height of the shipment; must be positive.
     * @param width The width of the shipment; must be positive.
     * @param length The length of the shipment; must be positive.
     * @throws Error if any dimension is non-positive.
     */
    constructor(height: number, width: number, length: number) {
      if (height <= 0 || width <= 0 || length <= 0) {
        throw new DomainError("All dimensions must be positive values.");
      }
      
      this.height = height;
      this.width = width;
      this.length = length;
    }
  
    /**
     * Compares this Dimensions with another.
     * @param other The other Dimensions to compare.
     * @returns true if all dimensions are equal.
     */
    public equals(other: Dimensions): boolean {
      return (
        this.height === other.height &&
        this.width === other.width &&
        this.length === other.length
      );
    }
  
    public toString(): string {
      return `Dimensions { height: ${this.height}, width: ${this.width}, length: ${this.length} }`;
    }
  }
  