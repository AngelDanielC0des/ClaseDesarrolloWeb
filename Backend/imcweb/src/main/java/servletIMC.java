

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Scanner;

/**
 * Servlet implementation class servletIMC
 */
@WebServlet("/servletIMC")
public class servletIMC extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public servletIMC() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//  actualizar la cuenta del contexto de cuántas veces han llamado a sevletIMC
		ServletContext servletContext = getServletContext();
		Object  nveces =  servletContext.getAttribute("numero_veces");
		int numveces = (int) nveces;
		numveces ++;
		System.out.println("Se ha invocado a CalculoIMV" + numveces + "veces.");
		servletContext.setAttribute("numero_veces", nveces);
		
		
		String peso = request.getParameter("peso");
		String altura = request.getParameter("altura");
	
		if (peso!=null && altura!=null) {
			
		try {
			float pesoParseado = Float.parseFloat(peso);
			float alturaParseada = Float.parseFloat(altura);
		
			// CALCULAR EL IMC
			float imc_numerico = pesoParseado / (alturaParseada * alturaParseada);
			// TRADUCCIÓN de imc_numérico a imc_nominal
			String imc_nominal = ""; 
			if (imc_numerico < 16) {
				// DESNUTRIDO
				imc_nominal = "DESNUTRIDO";
				response.setContentType("text/plain");
				response.getWriter().append("Usted esta " + imc_nominal);
			} else if ((imc_numerico >= 16) && (imc_numerico < 18)) {
				// DELGADO
				imc_nominal = "DELGADO";
				response.setContentType("text/plain");
				response.getWriter().append("Usted esta " + imc_nominal);
			} else if ((imc_numerico >= 18) && (imc_numerico < 25)) {
				// IDEAL
				imc_nominal = "IDEAL";
				response.setContentType("text/plain");
				response.getWriter().append("Usted esta " + imc_nominal);
			} else if ((imc_numerico >= 25) && (imc_numerico < 31)) {
				// SOBREPESO
				imc_nominal = "SOBREPESO";
				response.setContentType("text/plain");
				response.getWriter().append("Usted esta" + imc_nominal);
			} else {
				// OBESO
				imc_nominal = "OBESO";
				response.setContentType("text/plain");
				ImcRespuataNueva imcRespuestaNueva = new ImcRespuataNueva (pesoParseado,alturaParseada, imc_nominal, imc_numerico); 
				response.getWriter().append("Usted esta " + imc_nominal);
				}
			// INFORMAR
		
		} catch (ArrayIndexOutOfBoundsException fallo) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.setContentType("text/plain");
			response.getWriter().append("Introduce los decimales con comas Array");
			//System.out.println( "FALLO = " +fallo.getMessage());
		}  
		catch (NullPointerException fallo) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.setContentType("text/plain");
			response.getWriter().append("Introduce los decimales con comas Array");
			//System.out.println( "FALLO = " +fallo.getMessage());
		}  
		catch (Throwable fallo) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.setContentType("text/plain");
			response.getWriter().append("Introduce los decimales con comas Exception");
			
		}  

	}else { response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	response.setContentType("text/plain");
	response.getWriter().append("Introduce los parámetros");}
		}}
		



