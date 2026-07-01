package edu.xtd.opositest.modelo;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

public record ImcEntrada 
(@Positive (message= "no se permiten numeros negativos") @Min(value = 0, message ="debe ser mayor que 0") float peso, 
@Positive (message= "no se permiten numeros negativos") @Min(value = 0, message ="debe ser mayor que 0")
float altura) {

}
