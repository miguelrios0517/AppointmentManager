import React from 'react';

function TailwindFormStyles(props) {

    return(
    <div className ="bg-gray-100">
        <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                <p class="mt-2 text-center text-sm text-gray-600 max-w">
                Already registered?
                <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">Sign in</a>
                </p>
            </div>

            <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div class="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                <form class="b-0 space-y-6" action="#" method="POST">
                    <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                    <div class="mt-1">
                        <input id="email" name="email" type="email" autocomplete="email" required class="" />
                    </div>
                    </div>

                    <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="mt-1">
                        <input id="password" name="password" type="password" autocomplete="current-password" required class="" />
                    </div>
                    </div>

                    <div>
                    <label for="company-size" class="block text-sm font-medium text-gray-700">Company size</label>
                    <div class="mt-1">
                        <select name="company-size" id="company-size" class="">
                        <option value="">Please select</option>
                        <option value="small">1 to 10 employees</option>
                        <option value="medium">11 to 50 employees</option>
                        <option value="large">50+ employees</option>
                        </select>
                    </div>
                    </div>

                    <div class="flex items-center">
                    <input id="terms-and-privacy" name="terms-and-privacy" type="checkbox" class="" />
                    <label for="terms-and-privacy" class="ml-2 block text-sm text-gray-900"
                        >I agree to the
                        <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms</a>
                        and
                        <a href="#" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.
                    </label>
                    </div>

                    <div>
                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign up</button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </div>
    );
}

export default TailwindFormStyles;