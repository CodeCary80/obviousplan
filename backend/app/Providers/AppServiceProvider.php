<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\PlanGenerationService;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(PlanGenerationService::class, function ($app) {
            return new PlanGenerationService();
        });
    }

    public function boot()
    {
        //
    }
}
