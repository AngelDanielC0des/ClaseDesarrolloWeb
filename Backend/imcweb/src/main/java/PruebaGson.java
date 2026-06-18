
import com.google.gson.Gson;
public class PruebaGson {
public static void main (String[] args) {
	ImcRespuataNueva imcRespuestaNueva = new ImcRespuataNueva(50f,1.60f, "IDEAL", 22f);
	Gson gson = new Gson();
	String respuestaJson = gson.toJson(imcRespuestaNueva);
	System.out.println(respuestaJson);
	ImcRespuataNueva iresp = gson.fromJson(respuestaJson, ImcRespuataNueva.class);
	System.out.println(iresp);
}
}
