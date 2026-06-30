package edu.xtd.opositest.modelo;

import jakarta.validation.constraints.Positive;

public record ImcEntrada (@Positive float peso, @Positive float altura) {

}
