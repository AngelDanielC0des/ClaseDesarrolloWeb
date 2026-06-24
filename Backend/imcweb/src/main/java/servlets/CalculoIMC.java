package servlets;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

import com.google.gson.Gson;

/**
 * Servlet implementation class CaculoIMC
 */
@WebServlet("/CalculoIMC")
public class CalculoIMC extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CalculoIMC() {
		super();
		// TODO Auto-generated constructor stub
	}

	// http://localhost:8080/imcwebprofe/CalculoIMC?peso=90&altura=2
	
	// http://IP:PUERTO/APP/SERVLET?parámetros..
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		//actuailzar la cuenta del contexto de cuántas veces han llamado a CalculoIMC
		ServletContext servletContext = getServletContext();
		Object nveces = servletContext.getAttribute("numero_veces");
		//CASTING: convierto de object a número, para poder sumar
		int numveces = (int) nveces;
		numveces = numveces+1;
		System.out.println("Se ha invocado a CalculoIMC " + numveces + " veces");
		servletContext.setAttribute("numero_veces", numveces);
		
		
		
		// OBTENER PESO Y ALTURA
		String peso = request.getParameter("peso");
		String altura = request.getParameter("altura");
		
		if ((peso!=null)&&(altura!=null))

		{
			try {
				// PASAMOS DE TEXTO A NÚMERO real
				float pesof = Float.parseFloat(peso);
				float alturaf = Float.parseFloat(altura);

				// HAGO EL CÁLCULO

				float imc_numerico = pesof / (alturaf * alturaf);
				// TRADUCCIÓN de imc_numérico a imc_nominal
				String imc_nominal = ""; // new String ("");
				if (imc_numerico < 16) {
					// DESNUTRIDO
					imc_nominal = "DESNUTRIDO";
				} else if ((imc_numerico >= 16) && (imc_numerico < 18)) {
					// DELGADO
					imc_nominal = "DELGADO";
				} else if ((imc_numerico >= 18) && (imc_numerico < 25)) {
					// IDEAL
					imc_nominal = "IDEAL";
				} else if ((imc_numerico >= 25) && (imc_numerico < 31)) {
					// SOBREPESO
					imc_nominal = "SOBREPESO";
				} else {
					// OBESO
					imc_nominal = "OBESO";
				}
				// INFORMAR
				String respuesta = "Su imc es " + imc_numerico + " " + imc_nominal;
				System.out.println(respuesta);
				
				//asignamos el tipo de respuesta: TIPO MIME
				//response.setContentType("text/plain");
				response.setContentType("application/json");
				ImcRespuestaNueva imcRespuestaNueva = new ImcRespuestaNueva(pesof, alturaf, imc_nominal, imc_numerico);

				//Cada vez que se calcula un IMC de manera exitosa, lo guardo
				//en el contexto. Y así, tengo una lista con todos los Imcs calculados
				ArrayList<ImcRespuestaNueva> lista = (ArrayList<ImcRespuestaNueva>) servletContext.getAttribute("listaIMC");
				lista.add(imcRespuestaNueva);
				servletContext.setAttribute("listaIMC", lista);
				
				Gson gson  =new Gson();
				String respuestaImcJson = gson.toJson(imcRespuestaNueva);
				
				System.out.println(imcRespuestaNueva);
				System.out.println(respuestaImcJson);
				
				//response.getWriter().write(respuesta);
				response.getWriter().write(respuestaImcJson);
			} 	
			catch (Exception e) {
				// TODO: handle exception
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().write("peso y altura deben ser números");
			}
		} else {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().write("Debe adjuntar los parámetro peso y altura");
		}
		
		

	}

}
