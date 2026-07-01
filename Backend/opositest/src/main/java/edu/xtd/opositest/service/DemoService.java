package edu.xtd.opositest.service;

import org.springframework.stereotype.Service;

import edu.xtd.opositest.modelo.ImcEntrada;
import edu.xtd.opositest.modelo.ImcResultado;

@Service
public class DemoService {

	public ImcResultado calcularImc(ImcEntrada imcentrada) {
		ImcResultado imcResultado = null;
		String imcNominal = null;

		float imcnum = imcentrada.peso() / (imcentrada.altura() * imcentrada.altura());

		if (imcnum < 18.5) {
			imcNominal = "Bajo peso";
		} else if (imcnum >= 18.5 && imcnum < 25.0) {
			imcNominal = "Normal";
		} else if (imcnum >= 25.0 && imcnum < 30.0) {
			imcNominal = "Sobrepeso";
		} else if (imcnum >= 30.0 && imcnum < 35.0) {
			imcNominal = "Obesidad clase I";
		} else if (imcnum >= 35.0 && imcnum < 40.0) {
			imcNominal = "Obesidad clase II";
		} else {
			imcNominal = "Obesidad clase III";
		}

		imcResultado = new ImcResultado(imcentrada.peso(), imcentrada.altura(), imcnum, imcNominal);

		return imcResultado;
	}
}
