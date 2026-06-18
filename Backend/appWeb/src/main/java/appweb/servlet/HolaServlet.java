package appweb.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet implementation class HolaServlet
 */
@WebServlet("/HolaServlet")
public class HolaServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public HolaServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String edadRecibida = request.getParameter("edad");
		String nombreRecibido = request.getParameter("nombre");
		String mensaje2 = "No tenemos nombre o edad";
		String mensaje = "Me llamo" + nombreRecibido + "y tengo" + edadRecibida + "años";
		if (nombreRecibido!=null  || edadRecibida!=null) {System.out.println("Nombre recibido = " + nombreRecibido);
		response.getWriter().append(mensaje);}
		
		else {
			System.out.println("No tenemos nombre o edad");
		
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().append(mensaje2);
		}}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
