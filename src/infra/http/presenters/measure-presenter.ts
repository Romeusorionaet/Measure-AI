import { Measure } from "src/domain/vision-meter/enterprise/entities/measure";

export class MeasurePresenter {
  static toHTTP(measure: Measure) {
    return {
      measure_uuid: measure.id.toString(),
      measure_datetime: measure.measureDatetime,
      measure_type: measure.measureType,
      has_comfirmed: measure.hasConfirmed,
      image_url: measure.imageUrl,
    };
  }
}
