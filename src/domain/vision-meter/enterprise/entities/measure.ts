import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { MeasureType } from "./measure-type";
import { Entity } from "@/core/entities/entity";
import { Optional } from "@/core/@types/optional";

export interface MeasureProps {
  customerId: UniqueEntityID;
  measureDatetime: string;
  measureType: MeasureType;
  measureValue: number;
  hasConfirmed: boolean;
  imageUrl: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Measure extends Entity<MeasureProps> {
  get customerId() {
    return this.props.customerId;
  }

  get measureDatetime() {
    return this.props.measureDatetime;
  }

  get measureType() {
    return this.props.measureType;
  }

  get measureValue() {
    return this.props.measureValue;
  }

  get hasConfirmed() {
    return this.props.hasConfirmed;
  }

  private set hasConfirmed(value: boolean) {
    this.props.hasConfirmed = value;
    this.touch();
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<MeasureProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const measure = new Measure(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return measure;
  }

  update(props: Partial<MeasureProps>): Measure {
    return new Measure(
      {
        ...this.props,
        ...props,
        updatedAt: new Date(),
      },
      this.id,
    );
  }
}
