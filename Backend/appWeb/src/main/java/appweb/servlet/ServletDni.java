package appweb.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Servlet implementation class ServletDni
 */

@WebServlet("/ServletDni")
public class ServletDni extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ServletDni() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		String numeroDni = request.getParameter("numeroDni");
		if (numeroDni != null) {
			char letraDevuelta = ' ';
			final String SECUENCIA_LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";
			int numeroDniparseado = 0;
			try {
				numeroDniparseado = Integer.parseInt(numeroDni);
				int resto = numeroDniparseado % 23;
				letraDevuelta = SECUENCIA_LETRAS_DNI.charAt(resto);
				response.getWriter().append("Su DNI con letra es:" + numeroDni + "-" + letraDevuelta);

			} catch (NumberFormatException e) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().append("No ha introduccido un número");
			
			}

		} else {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().append("Se esperaba un parámetro numero");
		}
		
	}

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
