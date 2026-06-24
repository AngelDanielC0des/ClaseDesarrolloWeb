package servlets;

import com.google.gson.Gson;

public class PruebaGson {
	
	public static void main(String[] args) {
		
		ImcRespuestaNueva imcRespuestaNueva = new ImcRespuestaNueva(50f, 1.60f, "IDEAL", 22f);
		Gson gson = new Gson();
		//SERIALIZAR pasando de Objeto a String
		String respuestaJson = gson.toJson(imcRespuestaNueva);
		System.out.println(respuestaJson);
		//DESERIALIZAR pasando de String a objeto
		ImcRespuestaNueva iresp = gson.fromJson(respuestaJson, ImcRespuestaNueva.class);
		System.out.println(iresp);
	}

}
