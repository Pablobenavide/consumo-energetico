const { RecommendationService } = require('../../src/services/recommendationService');

describe('RecommendationService', () => {
  it('returns a short recommendation for normal usage', () => {
    const service = new RecommendationService();

    expect(service.getRecommendations(90)).toEqual([
      'Su consumo es saludable. Mantenga hábitos eficientes y revise el uso en horas valle.',
    ]);
  });

  it('returns two recommendations for high usage', () => {
    const service = new RecommendationService();

    expect(service.getRecommendations(350)).toEqual([
      'Considere reducir el tiempo de uso de los dispositivos de mayor consumo.',
      'Su consumo es elevado. Revise equipos de alto consumo como neveras, calentadores o aires acondicionados.',
    ]);
  });
});