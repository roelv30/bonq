@extends('master')

@section('content')
<main class="container">
  <div class="container__section">
    <br>
    <h3 aling="center">Add Data</h3>
    <br>

    @if(count($errors) > 0)
      <div class="alert alert-danger">
        <ul>
          @foreach($errors->all as $error)
              <li>{{$error}}</li>
          @endforeach
        </ul>
      </div>
    @endif

    @if(\Session::has('succes'))
      <div class="alert alert-success">
        <p>{{\Session::get('success')}}</p>
      </div>
    @endif

    <form class="container__section__form" action="{{url('users')}}" method="post">
      {{csrf_field()}}
      <div class="form__element">
        <button class="container__section__form__button" type="button" name="button">Make Admin</button>
      </div>

      <div class="container__section__form">
        <button class="container__section__form__button" type="button" name="button">Make Host</button>
      </div>

      <div class="container__section__form">
        <button class="container__section__form__button" type="button" name="button">Make Player</button>
      </div>
      
    </form>
  </div>
</main>


@endsection
