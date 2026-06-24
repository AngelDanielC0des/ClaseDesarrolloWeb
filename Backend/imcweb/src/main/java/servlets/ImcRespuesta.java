package servlets;

//BEAN, JAVABEAN, POJO PLAIN OLD JAVA OBJECT

public class ImcRespuesta {
	
	//los atributos de una clase, son privados por definición
	
	private float peso;
	private float altura;
	private String imcNominal;
	private float imcNumerico;
	
	public ImcRespuesta(float peso, float altura, String imcNominal, float imcNumerico) {
		super();
		this.peso = peso;
		this.altura = altura;
		this.imcNominal = imcNominal;
		this.imcNumerico = imcNumerico;
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
		return imcNominal;
	}

	public void setImcNominal(String imcNominal) {
		this.imcNominal = imcNominal;
	}

	public float getImcNumerico() {
		return imcNumerico;
	}

	public void setImcNumerico(float imcNumerico) {
		this.imcNumerico = imcNumerico;
	}
	
	

	
	

}
