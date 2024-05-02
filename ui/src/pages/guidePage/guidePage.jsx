import React, { useRef } from "react";
import g from "./guidePage.module.scss";
import {
  Accordion,
  AccordionItem,
  BreadcrumbItem,
  Breadcrumbs,
  Chip,
  Code,
  Listbox,
  ListboxItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Snippet,
} from "@nextui-org/react";
import { TopArrow } from "../../icons/topArrow";
import "./nextui.scss";
import { Coding } from "../../icons/coding";
import { Link } from "@nextui-org/react";
export const GuidePage = () => {
  const onMouseOnShowValues = (e) => {
    const element = e.target;
    return element.setAttribute("type", "text");
  };
  const onMouseOutHideValue = (e) => {
    const element = e.target;
    return element.setAttribute("type", "password");
  };

  return (
    <div className={g.guidePage}>
      <div className={g.paragraphPage}>
        <h1 className={g.main_text}>
          Welcome on the guide which based on Theater project
        </h1>
        <div className={g.authorization_par}>
          <span className={g.title}>
            <TopArrow />
            Authorization
          </span>
          <div className={g.authorization_text}>
            <p>
              If you unfortunately not authorized yet please{" "}
              <span>follow the steps</span>.
            </p>
            <Breadcrumbs
              variant="solid"
              style={{ marginLeft: "20px", marginBottom: "10px" }}
            >
              <BreadcrumbItem>
                Hover on the user icon on right side of the page
              </BreadcrumbItem>
              <BreadcrumbItem>Click signin or login</BreadcrumbItem>
              <BreadcrumbItem>Fill all fields</BreadcrumbItem>
              <BreadcrumbItem>Congratulations</BreadcrumbItem>
            </Breadcrumbs>
            <p>
              After you signed up you got ability to all functionality of the
              Theater.
            </p>
            <Accordion variant="bordered" className="accordion">
              <AccordionItem title="About Authorization" indicator={<Coding />}>
                <span className="mainAccordionDisc">
                  This Project has multiple layers of authentication and
                  authorization such as.
                </span>
                <Accordion variant="bordered" className="podaccordion">
                  <AccordionItem title="Email/Password Authentication">
                    The user provides their email and password. The server
                    checks if the email is registered in the system. If the
                    email is registered, the server verifies the password. If
                    the password is correct, the server issues a JWT (JSON Web
                    Token) representing the user's identity. The JWT contains
                    claims such as user ID, email, and roles. The client stores
                    the JWT securely (usually in local storage or cookies) and
                    includes it in
                  </AccordionItem>
                  <AccordionItem title="Social Authentication (GitHub/Google)">
                    Users sign in to the application using their social media
                    accounts (e.g., GitHub or Google). The application redirects
                    users to the authentication page of the chosen social media
                    provider, where they enter their credentials and authorize
                    the application to access their account information. Upon
                    authorization, the social media provider issues an access
                    token to the application. The application verifies the
                    token's validity with the social media provider and receives
                    user information, such as username and email. Using this
                    information, the application generates a JWT (JSON Web
                    Token) representing the user's identity. The client securely
                    stores the JWT and includes it in subsequent requests to the
                    server. The server validates the JWT on each request to
                    authenticate and authorize the user, allowing access to
                    protected resources based on their identity and permissions
                    granted by the social media provider.
                  </AccordionItem>
                  <AccordionItem title="JWT (JSON Web Token)">
                    JWTs are used for secure transmission of information between
                    parties. They contain claims about the user and are signed
                    to ensure their integrity. The server verifies the JWT on
                    each request to authenticate and authorize the user. If the
                    JWT is valid, the server extracts user information from the
                    token's claims and processes the request accordingly. If the
                    JWT is invalid (e.g., expired or tampered with), the server
                    rejects the request.
                  </AccordionItem>
                </Accordion>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className={g.authorization_par}>
          <span className={g.title}>
            <TopArrow />
            Launch project using coding redactor
          </span>
          <div className={g.authorization_text}>
            <p>
              To launch this project first of all you have to{" "}
              <span>download/clone </span>
              repo from{" "}
              <Link
                isExternal
                href="https://github.com/oleksandrkovaliuk/Theatre"
                showAnchorIcon
              >
                github repository
              </Link>
            </p>
            <p>
              Once you got files in your code redactor. Open terminal and follow
              the steps.
            </p>
            <ul className={g.snipets_border}>
              <li>
                <span>
                  Install all modules in the project by goind{" "}
                  <Code>cd server/</Code> & <Code>cd ui/</Code>or in main folder
                  type.
                </span>
                <Snippet
                  size="sm"
                  style={{ maxWidth: "137px", maxHeight: "30px" }}
                >
                  npm install
                </Snippet>
              </li>
              <li>
                <span>
                  After installing all modules you ready to launch project in
                  Poject mode writing.
                </span>
                <Snippet
                  size="sm"
                  style={{ maxWidth: "152px", maxHeight: "30px" }}
                >
                  npm run start
                </Snippet>
                <span style={{ textAlign: "right" }}>
                  <b>
                    Feel free to commit n push your changes i will check them in
                    pull request.
                  </b>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className={g.authorization_par}>
          <span className={g.title}>
            <TopArrow />
            Managing theater through admin user
          </span>
          <div className={g.authorization_text}>
            <p>
              If you wanna check ability of admin user. All what you have to do
              its just login with.
            </p>
            <ul className={g.snipets}>
              <li>
                <label for="adminEmail" className={g.hiddenInfo}>
                  Admin @Email
                </label>
                <input
                  type="password"
                  id="adminEmail"
                  name="adminEmail"
                  onMouseOver={onMouseOnShowValues}
                  onMouseOut={onMouseOutHideValue}
                  className={g.value}
                  value={process.env.REACT_APP_ADMIN_EMAIL}
                  disabled
                ></input>
              </li>
              <li>
                <label for="adminPass" className={g.hiddenInfo}>
                  Admin Password
                </label>
                <input
                  type="password"
                  id="adminPass"
                  name="adminPass"
                  onMouseOver={onMouseOnShowValues}
                  onMouseOut={onMouseOutHideValue}
                  className={g.value}
                  value={process.env.REACT_APP_ADMIN_PASSWORD}
                  disabled
                ></input>
              </li>
            </ul>
            <p>
              As a <span>admin</span> you are able to..
            </p>
            <div className={g.ability_list}>
              <Popover
                showArrow
                style={{ maxWidth: "300px", padding: "5px" }}
                placement="top-start"
              >
                <PopoverTrigger>
                  <span className={g.title}>
                    <TopArrow />
                    Managing/changing/deleting events
                  </span>
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    Managing events it is the page on which you are able
                    changing all current{" "}
                    <Chip size="sm" variant="flat" color="success">
                      active
                    </Chip>{" "}
                    events. Modifying all thear fields however you want , as
                    well as modifiyng couple events in one time.
                  </div>
                </PopoverContent>
              </Popover>
              <Popover
                showArrow
                style={{ maxWidth: "300px", padding: "5px" }}
                placement="top-start"
              >
                <PopoverTrigger>
                  <span className={g.title}>
                    <TopArrow />
                    Creating new events
                  </span>
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    Creating new event page it place were you can create new
                    events to the current upcoming premier list.
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className={g.authorization_par}>
          <span className={g.title}>
            <TopArrow />
            User ability on Theater
          </span>
          <div className={g.authorization_text}>
            <p>
              Regular <span>client</span> of this page can..
            </p>
            <div className={g.ability_list}>
              <Popover
                showArrow
                style={{ maxWidth: "300px", padding: "5px" }}
                placement="top-start"
              >
                <PopoverTrigger>
                  <span className={g.title}>
                    <TopArrow />
                    Check all upcoming events
                  </span>
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    On the main page we have all our events which automatically
                    before showing went throught authentification if this event
                    is still{" "}
                    <Chip size="sm" variant="flat" color="success">
                      active
                    </Chip>{" "}
                    .
                  </div>
                </PopoverContent>
              </Popover>
              <Popover
                showArrow
                style={{ maxWidth: "300px", padding: "5px" }}
                placement="top-start"
              >
                <PopoverTrigger>
                  <span className={g.title}>
                    <TopArrow />
                    Book seats.
                  </span>
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    When user went on booking page with all avaleable seats for
                    this speciall event. He chose any seat/s he wanna book we
                    showing him bottom menu where e able to go on next step of
                    booking and see total as well as his booked tickets . Next
                    step is Payment our payment method handled with using{" "}
                    <b>Stripe</b>. Once paymet succesfully approved user going
                    on finall page with his ticket and ability of{" "}
                    <b>download</b> or <b>recieve his ticket on email</b>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover
                showArrow
                style={{ maxWidth: "300px", padding: "5px" }}
                placement="top-start"
              >
                <PopoverTrigger>
                  <span className={g.title}>
                    <TopArrow />
                    History of booked ticket.
                  </span>
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    History of booked tickets by user of all time it is the page
                    for user to check his all booked seats from most{" "}
                    <b>recent </b>to
                    <b> latest</b>. On this page he will see <b>time</b> when he
                    booked especiall event status if it is still{" "}
                    <Chip size="sm" variant="flat" color="success">
                      active
                    </Chip>{" "}
                    or{" "}
                    <Chip size="sm" variant="flat" color="danger">
                      expired
                    </Chip>{" "}
                    if event is <b>expired</b> he able to delete event from
                    history page or if its <b>active</b> he can cancel with
                    money <b>refund </b>. As well as check his ticket{" "}
                    <b>download</b>/<b>recieve on the email</b> him.
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className={g.authorization_par}>
          <span className={g.title}>
            <TopArrow />
            About project
          </span>
          <div className={g.authorization_text}>
            <p>
              A little bit info about theater . Theater been create on
              <b> React.js/Node.js(Express.js)</b> stack. I was curious how
              cinema theater website works that borned idei to create Theater
              .As closer as i could i recreated all cinema theaters logic which
              thear using.
            </p>
            <p>
              Theater has a lot ways and layers of <span>Authorization</span> in
              which im using <b>JWT Token</b> as a Barear. All data stored using{" "}
              <b>PostgreSQL</b> as a DB and <b>Dbeaver</b> as UI manager.
            </p>
            <p>
              All content which you seeing on the page called or managed with
              using <b>Back-end</b>. Tried protect all page information. And
              call her only when needed.
            </p>
            <div style={{ textAlign: "center" }}>
              I hope you enjoyed your theater experience. Support my{" "}
              <Link
                isExternal
                href="https://github.com/oleksandrkovaliuk"
                showAnchorIcon
              >
                github
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
