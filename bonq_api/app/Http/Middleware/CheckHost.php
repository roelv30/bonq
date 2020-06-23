<?php

namespace App\Http\Middleware;
use Auth;
use Closure;

class CheckHost
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if((Auth::user()->role == "host") || (Auth::user()->role == "admin")){
          return $next($request);
        }
        return redirect("/");
    }
}
