class RecommendationService {
  getRecommendations(totalConsumption) {
    const recommendations = [];

    if (totalConsumption > 100) {
      recommendations.push('Considere reducir el tiempo de uso de los dispositivos de mayor consumo.');
    }

    if (totalConsumption > 300) {
      recommendations.push('Su consumo es elevado. Revise equipos de alto consumo como neveras, calentadores o aires acondicionados.');
    }

    if (!recommendations.length) {
      recommendations.push('Su consumo es saludable. Mantenga hábitos eficientes y revise el uso en horas valle.');
    }

    return recommendations;
  }
}

module.exports = { RecommendationService };