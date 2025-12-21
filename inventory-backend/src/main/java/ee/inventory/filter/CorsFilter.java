package ee.inventory.filter;

import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import org.reactivestreams.Publisher;
import reactor.core.publisher.Mono;

@Filter("/**")
public class CorsFilter implements HttpServerFilter {

    @Override
    public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request,
                                                      ServerFilterChain chain) {

        System.out.println("═══════════════════════════════════════");
        System.out.println("CORS Filter activated!");
        System.out.println("Method: " + request.getMethod());
        System.out.println("Path: " + request.getPath());
        System.out.println("Origin: " + request.getHeaders().get("Origin"));
        System.out.println("═══════════════════════════════════════");

        if ("OPTIONS".equals(request.getMethod().name())) {
            MutableHttpResponse<?> response = HttpResponse.ok();
            addCorsHeaders(response, request);
            return Mono.just(response);
        }

        return Mono.from(chain.proceed(request))
                .map(response -> {
                    addCorsHeaders(response, request);
                    return response;
                });
    }

    private void addCorsHeaders(MutableHttpResponse<?> response, HttpRequest<?> request) {
        String origin = request.getHeaders().get("Origin");
        if (origin == null || origin.isEmpty()) {
            origin = "*";
        }

        response.header("Access-Control-Allow-Origin", origin);
        response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
        response.header("Access-Control-Allow-Credentials", "true");
        response.header("Access-Control-Max-Age", "3600");
        response.header("Access-Control-Expose-Headers", "*");

        System.out.println("CORS headers added to response");
    }
}
