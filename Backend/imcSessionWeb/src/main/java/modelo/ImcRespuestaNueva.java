package modelo;

//Los records es la forma mnueva de Java de hacer clases sencillas (Java Bean)
//que me permiten definir un modelo de datos

public record ImcRespuestaNueva(
		float peso,
		float altura,
		String imcNominal,
		float imcNumerico) 

{

}
