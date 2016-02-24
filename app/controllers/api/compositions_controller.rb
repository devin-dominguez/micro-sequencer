class Api::CompositionsController < ApplicationController

  def index
    @compositions = Composition.all;

    render :index
  end

  private

  def composition_params
    params.require(:composition).permit(:title, :public, :composition)
  end
end
