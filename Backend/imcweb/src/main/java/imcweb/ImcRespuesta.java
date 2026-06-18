package imcweb;

public class ImcRespuesta {
private float peso;
private float altura;
private String ImcNominal;
private float ImcNumerico;

public ImcRespuesta(float peso, float altura, String imcNominal, float imcNumerico) {
	super();
	this.peso = peso;
	this.altura = altura;
	ImcNominal = imcNominal;
	ImcNumerico = imcNumerico;
}

public float getPeso() {
	return peso;
}

public void setPeso(float peso) {
	this.peso = peso;
}

public float getAltura() {
	return altura;
}

public void setAltura(float altura) {
	this.altura = altura;
}

public String getImcNominal() {
	return ImcNominal;
}

public void setImcNominal(String imcNominal) {
	ImcNominal = imcNominal;
}

public float getImcNumerico() {
	return ImcNumerico;
}

public void setImcNumerico(float imcNumerico) {
	ImcNumerico = imcNumerico;
}


}