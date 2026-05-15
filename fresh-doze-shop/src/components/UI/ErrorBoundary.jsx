import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Оновлюємо стейт, щоб наступний рендер показав запасний UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Тут можна логувати помилку в зовнішній сервіс
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-red-100 max-w-md">
            <h2 className="text-2xl font-black text-gray-800 mb-4">
              Упс! Щось пішло не так..
            </h2>
            <p className="text-gray-500 mb-6 font-medium">
              Сталася критична помилка. Спробуйте оновити сторінку або
              повернутися пізніше.
            </p>
            <button
              onClick={() => window.location.reload()}
              className=" w-full bg-[#00a693] text-white font-black py-4 rounded-2xl hover:bg-[#008d7d] transition-all shadow-lg hover:shadow-xl"
            >
              ОНОВИТИ СТОРІНКУ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
